package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)

public class MenuItemReviewIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    MenuItemReviewRepository menuitemReviewRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2000-01-01T12:00:00");


            MenuItemReview menuitemreview = MenuItemReview.builder()
            .itemId(1L)
            .reviewerEmail("stevenle@ucsb.edu")
            .stars(1)
            .dateReviewed(ldt1)
            .comments("Amazing")
            .build();

menuitemReviewRepository.save(menuitemreview);

// act
MvcResult response = mockMvc.perform(get("/api/MenuItemReview?id=1"))
            .andExpect(status().isOk()).andReturn();

// assert
String expectedJson = mapper.writeValueAsString(menuitemreview);
String responseString = response.getResponse().getContentAsString();
assertEquals(expectedJson, responseString);
}



@WithMockUser(roles = { "ADMIN", "USER" })
@Test
public void an_admin_user_can_post_a_new_menuitemreview() throws Exception {
// arrange

LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

MenuItemReview menuitemreview1 = MenuItemReview.builder()
            .id(1L)
            .itemId(1L)
            .reviewerEmail("stevenle@ucsb.edu")
            .stars(1)
            .dateReviewed(ldt1)
            .comments("Amazing")
            .build();

// act
MvcResult response = mockMvc.perform(
            post("/api/MenuItemReview/post?itemId=1&reviewerEmail=stevenle@ucsb.edu&stars=1&dateReviewed=2022-01-03T00:00:00&comments=Amazing")
                            .with(csrf()))
            .andExpect(status().isOk()).andReturn();

// assert
String expectedJson = mapper.writeValueAsString(menuitemreview1);
String responseString = response.getResponse().getContentAsString();
assertEquals(expectedJson, responseString);
}
}