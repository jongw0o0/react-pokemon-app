package com.pokepoke.arch.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokepoke.arch.entity.CardLike;
import com.pokepoke.arch.repository.CardLikeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CardLikeService {

    private final CardLikeRepository cardLikeRepository;

    public String toggleLike(Long memberId, String cardId) {
        Optional<CardLike> existingLike = cardLikeRepository.findByMemberIdAndCardId(memberId, cardId);

        if (existingLike.isPresent()) {
            cardLikeRepository.delete(existingLike.get());
            return "UNLIKED";
        } else {
            CardLike newLike = new CardLike();
            newLike.setMemberId(memberId);
            newLike.setCardId(cardId);
            cardLikeRepository.save(newLike);
            return "LIKED";
        }
    }

    @Transactional(readOnly = true)
    public boolean getLikeStatus(Long memberId, String cardId) {
        return cardLikeRepository.findByMemberIdAndCardId(memberId, cardId).isPresent();
    }

    @Transactional(readOnly = true)
    public List<String> getLikeList(Long memberId) {
        return cardLikeRepository.findByMemberId(memberId)
                .stream()
                .map(CardLike::getCardId)
                .collect(Collectors.toList());
    }
}