package com.pokepoke.arch.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeckDetailDto {
    private Long memberId;
    private String userName;
    private String deckName;
    private List<String> energies;
    private String deckComment;
    private List<String> apiCardIds; 
    private String representativeCardId;
    private String representativeImageUrl;
    private String isPublic;
    private boolean isScrapped;
}
