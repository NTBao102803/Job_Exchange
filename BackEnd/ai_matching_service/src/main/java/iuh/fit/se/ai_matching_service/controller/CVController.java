package iuh.fit.se.ai_matching_service.controller;


import iuh.fit.se.ai_matching_service.dto.CVRequest;
import iuh.fit.se.ai_matching_service.dto.CVResponse;
import iuh.fit.se.ai_matching_service.service.CVService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cv")
public class CVController {
    private final CVService cvService;

    public CVController(CVService cvService) {
        this.cvService = cvService;
    }

    @PostMapping("/generate")
    public CVResponse generate(@RequestBody CVRequest request) {
        return cvService.generateCV(request);
    }
}
