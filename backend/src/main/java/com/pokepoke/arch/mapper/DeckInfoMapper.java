package com.pokepoke.arch.mapper;

import com.pokepoke.arch.dto.DeckDetailDto;
import com.pokepoke.arch.dto.DeckInfoDto;
import com.pokepoke.arch.entity.Deck;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DeckInfoMapper {

    // 엔티티를 리스트 노출용 DTO로 변환
    public DeckInfoDto entityToDto(Deck deck) {
        DeckInfoDto dto = new DeckInfoDto();
        dto.setDeckId(deck.getId());
        dto.setDeckName(deck.getDeckName());
        dto.setEnergies(deck.getEnergies());
        dto.setDeckComment(deck.getDeckComment());
        dto.setUserName(deck.getMember().getName());
        dto.setRepresentativeCardId(deck.getRepresentativeCardId());
        dto.setRepresentativeImageUrl(deck.getRepresentativeImageUrl());
        dto.setCreatedAt(deck.getRegTime());
        dto.setScrapCount(deck.getScrapCount() != null ? deck.getScrapCount() : 0L);
        dto.setViews(deck.getViews() != null ? deck.getViews().longValue() : 0L);
        
        return dto;
    }

    // 엔티티를 상세 보기용 DTO로 변환
    public DeckDetailDto entityToDetailDto(Deck deck, List<String> apiCardIds) {
        DeckDetailDto dto = new DeckDetailDto();
        dto.setMemberId(deck.getMember().getId());
        dto.setUserName(deck.getMember().getName());
        dto.setDeckName(deck.getDeckName());
        dto.setEnergies(deck.getEnergies());
        dto.setDeckComment(deck.getDeckComment());
        dto.setApiCardIds(apiCardIds);
        dto.setIsPublic(deck.getIsPublic());
        dto.setRepresentativeCardId(deck.getRepresentativeCardId());
        dto.setRepresentativeImageUrl(deck.getRepresentativeImageUrl());
        dto.setScrapCount(deck.getScrapCount() != null ? deck.getScrapCount() : 0L);
        dto.setViews(deck.getViews() != null ? deck.getViews().longValue() : 0L);
        return dto;
    }
}