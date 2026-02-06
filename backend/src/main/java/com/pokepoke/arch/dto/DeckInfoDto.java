package com.pokepoke.arch.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeckInfoDto {
    private Long deckId;

    private String deckName;

    private String deckComment;
    
    private String userName;

    private String representativeImageUrl;

    private String representativeCardId;
}
