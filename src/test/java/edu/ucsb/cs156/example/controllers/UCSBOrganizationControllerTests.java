package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBOrganizationController.class)
@Import(TestConfig.class)
public class UCSBOrganizationControllerTests extends ControllerTestCase {

        @MockBean
        UCSBOrganizationRepository ucsbOrganizationRepository;

        @MockBean
        UserRepository userRepository;

        // Tests for GET /api/ucsbOrganization/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/UCSBOrganization/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/UCSBOrganization/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_ucsbOrganization() throws Exception {

                // arrange

                UCSBOrganization coder = UCSBOrganization.builder()
                                .orgCode("c")
                                .orgTranslation("Coder")
                                .orgTranslationShort("Code")
                                .inactive(false)
                                .build();

                UCSBOrganization data = UCSBOrganization.builder()
                                .orgCode("DS")
                                .orgTranslation("Data Science")
                                .orgTranslationShort("Data")
                                .inactive(false)
                                .build();

                ArrayList<UCSBOrganization> expectedOrganization = new ArrayList<>();
                expectedOrganization.addAll(Arrays.asList(coder,data));

                when(ucsbOrganizationRepository.findAll()).thenReturn(expectedOrganization);

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBOrganization/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedOrganization);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/UCSBOrganization...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/UCSBOrganization/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/UCSBOrganization/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_organization() throws Exception {
                // arrange

                UCSBOrganization gaucho = UCSBOrganization.builder()
                                .orgCode("GR")
                                .orgTranslation("GauchoRadio")
                                .orgTranslationShort("GauRadio")
                                .inactive(true)
                                .build();

                when(ucsbOrganizationRepository.save(eq(gaucho))).thenReturn(gaucho);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/UCSBOrganization/post?orgCode=GR&orgTranslation=GauchoRadio&orgTranslationShort=GauRadio&inactive=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).save(gaucho);
                String expectedJson = mapper.writeValueAsString(gaucho);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
                @WithMockUser(roles = { "USER" })
        // Tests for PUT /api/UCSBOrganization?...

        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ucsbOrganizationRepository.findById(eq("www"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBOrganization?orgCode=www"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findById(eq("www"));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBOrganization with id www not found", json.get("message"));
        }
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_organization() throws Exception {
                // arrange

                UCSBOrganization coder = UCSBOrganization.builder()
                                .orgCode("c")
                                .orgTranslation("cooooder")
                                .orgTranslationShort("Code")
                                .inactive(false)
                                .build();

                UCSBOrganization coderEdited = UCSBOrganization.builder()
                                .orgCode("c")
                                .orgTranslation("coder")
                                .orgTranslationShort("co")
                                .inactive(true)
                                .build();

                String requestBody = mapper.writeValueAsString(coderEdited);

                when(ucsbOrganizationRepository.findById(eq("c"))).thenReturn(Optional.of(coder));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/UCSBOrganization?orgCode=c")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("c");
                verify(ucsbOrganizationRepository, times(1)).save(coderEdited); // should be saved with updated info
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_organization_that_does_not_exist() throws Exception {
                // arrange

                UCSBOrganization editedOrganization = UCSBOrganization.builder()
                                .orgCode("abc")
                                .orgTranslation("coder")
                                .orgTranslationShort("co")
                                .inactive(true)
                                .build();

                String requestBody = mapper.writeValueAsString(editedOrganization);

                when(ucsbOrganizationRepository.findById(eq("abc"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/UCSBOrganization?orgCode=abc")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("abc");
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganization with id abc not found", json.get("message"));

        }
        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                UCSBOrganization gaucho= UCSBOrganization.builder()
                                .orgCode("GR")
                                .orgTranslation("GauchoRadio")
                                .orgTranslationShort("GauRadio")
                                .inactive(true)
                                .build();

                when(ucsbOrganizationRepository.findById(eq("GR"))).thenReturn(Optional.of(gaucho));

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBOrganization?orgCode=GR"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findById(eq("GR"));
                String expectedJson = mapper.writeValueAsString(gaucho);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for DELETE /api/UCSBOrganization?...
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_organization() throws Exception {
                // arrange
                UCSBOrganization gaucho = UCSBOrganization.builder()
                                .orgCode("GR")
                                .orgTranslation("GauchoRadio")
                                .orgTranslationShort("GauRadio")
                                .inactive(true)
                                .build();

                when(ucsbOrganizationRepository.findById(eq("GR"))).thenReturn(Optional.of(gaucho));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/UCSBOrganization?orgCode=GR")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("GR");
                verify(ucsbOrganizationRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganization with id GR deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_commons_and_gets_right_error_message()
                        throws Exception {
                // arrange
                when(ucsbOrganizationRepository.findById(eq("www"))).thenReturn(Optional.empty());
                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/UCSBOrganization?orgCode=www")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();
                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("www");
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganization with id www not found", json.get("message"));
        }
        


}
