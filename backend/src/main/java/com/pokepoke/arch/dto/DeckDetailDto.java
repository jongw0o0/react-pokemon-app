package com.pokepoke.arch.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeckDetailDto {
    private Long memberId;
    private String userName;
    private String deckName;
    private String deckComment;
    private List<String> apiCardIds; 
    private String representativeCardId;
    private String representativeImageUrl;
}
