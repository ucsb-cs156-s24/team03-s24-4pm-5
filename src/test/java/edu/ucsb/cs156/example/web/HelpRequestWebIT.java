package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_help_request() throws Exception {
        setupUser(true);

        page.getByText("Help Request").click();

        page.getByText("Create HelpRequest").click();
        assertThat(page.getByText("Create New HelpRequest")).isVisible();

        page.getByTestId("HelpRequestForm-requesterEmail").fill("test@gmail.com");
        page.getByTestId("HelpRequestForm-teamId").fill("test");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("test");
        page.getByTestId("HelpRequestForm-requestTime").fill("2020-01-01T00:00");
        page.getByTestId("HelpRequestForm-explanation").fill("test");
        page.getByTestId("HelpRequestForm-solved").fill("true");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequest-cell-row-0-col-requesterEmail"))
                .hasText("test@gmail.com");

        page.getByTestId("HelpRequest-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit HelpRequest")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("test@ucsb.edu");
        page.getByTestId("HelpRequesttForm-submit").click();

        assertThat(page.getByTestId("HelpRequest-cell-row-0-col-requesterEmail")).hasText("test@ucsb.edu");

        page.getByTestId("HelpRequest-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequest-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_help_request() throws Exception {
        setupUser(false);

        page.getByText("Help Request").click();

        assertThat(page.getByText("Create HelpRequest")).not().isVisible();
        assertThat(page.getByTestId("HelpRequest-cell-row-0-col-requesterEmail")).not().isVisible();
    }
}
