package com.research.controller;

import com.research.service.ResearchRequest;
import com.research.service.ResearchService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("api/research")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ResearchController {
    private ResearchService researchService;
    private static final Logger logger = LoggerFactory.getLogger(ResearchController.class);

    @PostMapping("/process")
    public ResponseEntity<String> processContent(@RequestBody ResearchRequest researchRequest) {
        logger.info("Received request: {}", researchRequest);
        String result = researchService.processContent(researchRequest);
        return ResponseEntity.ok(result);
    }

}
