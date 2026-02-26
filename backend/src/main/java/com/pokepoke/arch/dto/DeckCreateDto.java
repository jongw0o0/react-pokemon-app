package com.pokepoke.arch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DeckCreateDto {

    @NotBlank(message = "덱 이름은 필수입니다.")
    private String deckName;

    private List<String> energies;

    private String deckComment;

    // TCGDex API의 ID 리스트
    @Size(min = 20, max = 20, message = "카드는 정확히 20장을 선택해야 합니다.")
    private List<String> apiCardIds; 

    private String representativeCardId;
    
    private String representativeImageUrl;

    private String isPublic;
}
