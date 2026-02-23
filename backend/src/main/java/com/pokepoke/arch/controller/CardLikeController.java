package com.pokepoke.arch.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pokepoke.arch.service.CardLikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardLikeController {

    private final CardLikeService cardLikeService;

    @PostMapping("/like")
    public ResponseEntity<String> toggleLike(@RequestBody Map<String, Object> request) {
        Long memberId = Long.valueOf(request.get("memberId").toString());
        String cardId = (String) request.get("cardId");
        
        return ResponseEntity.ok(cardLikeService.toggleLike(memberId, cardId));
    }

    @GetMapping("/like/status")
    public ResponseEntity<Boolean> getLikeStatus(@RequestParam Long memberId, @RequestParam String cardId) {
        return ResponseEntity.ok(cardLikeService.getLikeStatus(memberId, cardId));
    }

    @GetMapping("/like/list")
    public ResponseEntity<List<String>> getLikeList(@RequestParam Long memberId) {
        return ResponseEntity.ok(cardLikeService.getLikeList(memberId));
    }
}