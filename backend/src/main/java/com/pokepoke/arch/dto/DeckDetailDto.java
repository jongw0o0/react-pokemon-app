package com.pokepoke.arch.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeckDetailDto {
    private String deckName;
    private String deckComment;
    private String userName;
    private List<String> apiCardIds; 
    private String representativeCardId;
    private String representativeImageUrl;
}
