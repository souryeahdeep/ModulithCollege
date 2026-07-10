package org.college.user_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import java.util.UUID;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    private static UUID createdUserId;

    @Test
    @Order(1)
    void createUserTest() throws Exception {

        String requestJson = """
        {
            "email": "testuser@example.com",
            "firstName": "John",
            "lastName": "Doe"
        }
        """;

        MvcResult result = mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(response);
        System.out.println("RESPONSE: " + response);
        if (jsonNode.get("id") == null) {
            throw new RuntimeException("ID missing in response: " + response);
        }

        createdUserId = UUID.fromString(jsonNode.get("id").asText());
    }

    @Test
    @Order(2)
    void getUserTest() throws Exception {

        mockMvc.perform(get("/users/" + createdUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("testuser@example.com"));
    }
}
