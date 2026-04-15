package com.research.assistant;

import com.research.controller.ResearchController;
import com.research.service.ResearchRequest;
import com.research.service.ResearchService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ResearchController.class)
class ResearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ResearchService researchService;

    @Test
    void testProcessContent() throws Exception {
        // Arrange
        ResearchRequest request = new ResearchRequest();
        request.setContent("Spring Cloud provides tools for developers...");
        request.setOperation("summarize");

        String requestBody = """
                {
                    "content": "Spring Cloud provides tools for developers...",
                    "operation": "summarize"
                }
                """;

        String mockResponse = "Spring Cloud provides tools for distributed systems.";

        Mockito.when(researchService.processContent(Mockito.any(ResearchRequest.class)))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/research/process")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().string(mockResponse));
    }
}