package com.pokepoke.arch.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeckInfoDto {
    private Long deckId;

    private String deckName;
    
    private List<String> energies;

    private String deckComment;
    
    private String userName;

    private String representativeImageUrl;

    private String representativeCardId;

    private LocalDateTime createdAt;
    private Long views;
    private Long scrapCount;
}
