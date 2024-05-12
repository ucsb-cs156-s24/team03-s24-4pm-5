package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "MenuItemReview")
@RequestMapping("/api/MenuItemReview")
@RestController
@Slf4j
public class MenuItemReviewController extends ApiController {
    
    @Autowired
    MenuItemReviewRepository menuitemReviewRepository;

    @Operation(summary= "List all menu item reviews")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<MenuItemReview> allMenuItemReviews() {
        Iterable<MenuItemReview> menuitemReviews = menuitemReviewRepository.findAll();
        return menuitemReviews;
    }

    @Operation(summary= "Create a menu item review")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public MenuItemReview postMenuItemReview(
            @Parameter(name="itemId") @RequestParam Long itemId,
            @Parameter(name="reviewerEmail") @RequestParam String reviewerEmail,
            @Parameter(name="stars") @RequestParam int stars,
            @Parameter(name="dateReviewed") @RequestParam("dateReviewed") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateReviewed,
            @Parameter(name="comments") @RequestParam String comments
            )
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("dateReviewed={}", dateReviewed);

        MenuItemReview menuitemReview = new MenuItemReview();
        menuitemReview.setItemId(itemId);
        menuitemReview.setReviewerEmail(reviewerEmail);
        menuitemReview.setStars(stars);
        menuitemReview.setDateReviewed(dateReviewed);
        menuitemReview.setComments(comments);

        MenuItemReview savedMenuItemReview = menuitemReviewRepository.save(menuitemReview);

        return savedMenuItemReview;

         }

        @Operation(summary= "Get a single menu item review")
        @PreAuthorize("hasRole('ROLE_USER')")
        @GetMapping("")
        public MenuItemReview getById(
                @Parameter(name="id") @RequestParam Long id) {
                    MenuItemReview menuitemReview = menuitemReviewRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));
    
            return menuitemReview;
        }

        @Operation(summary= "Delete a menu item review")
        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @DeleteMapping("")
        public Object deleteMenuItemReview(
                @Parameter(name="id") @RequestParam Long id) {
                    MenuItemReview menuitemReview = menuitemReviewRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));
                    menuitemReviewRepository.delete(menuitemReview);
            return genericMessage("MenuItemReview with id %s deleted".formatted(id));
        }
    
        @Operation(summary= "Update a single menu item review")
        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @PutMapping("")
        public MenuItemReview updateMenuItemReview(
                @Parameter(name="id") @RequestParam Long id,
                @RequestBody @Valid MenuItemReview incoming) {
    
                    MenuItemReview menuitemReview = menuitemReviewRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));
    
                    menuitemReview.setItemId(incoming.getItemId());
                    menuitemReview.setReviewerEmail(incoming.getReviewerEmail());
                    menuitemReview.setStars(incoming.getStars());
                    menuitemReview.setDateReviewed(incoming.getDateReviewed());
                    menuitemReview.setComments(incoming.getComments());

                    menuitemReviewRepository.save(menuitemReview);
    
            return menuitemReview;
        }

}