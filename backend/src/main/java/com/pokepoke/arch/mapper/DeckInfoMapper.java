package com.pokepoke.arch.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.pokepoke.arch.dto.DeckInfoDto;
import com.pokepoke.arch.entity.Deck;

@Mapper(componentModel = "spring")
public interface DeckInfoMapper {

    // Deck 엔티티의 member 필드 안에 있는 name을 DeckInfoDto의 userName 필드로 매핑
    @Mapping(source = "id", target = "deckId")    
    @Mapping(source = "member.name", target = "userName")
    @Mapping(source = "representativeImageUrl", target = "representativeImageUrl")
    @Mapping(source = "representativeCardId", target = "representativeCardId")
    DeckInfoDto entityToDto(Deck deck);
}
