package com.pokepoke.arch.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.pokepoke.arch.dto.DeckDetailDto;
import com.pokepoke.arch.dto.DeckInfoDto;
import com.pokepoke.arch.entity.Deck;

@Mapper(componentModel = "spring")
public interface DeckInfoMapper {

    // Deck 엔티티의 member 필드 안에 있는 name을 DeckInfoDto의 userName 필드로 매핑
    @Mapping(source = "id", target = "deckId")    
    @Mapping(source = "member.name", target = "userName")
    @Mapping(source = "representativeImageUrl", target = "representativeImageUrl")
    @Mapping(source = "representativeCardId", target = "representativeCardId")
    @Mapping(source = "regTime", target = "createdAt")
    @Mapping(source = "views", target = "views")
    DeckInfoDto entityToDto(Deck deck);

    // 상세 조회용 매핑 추가
    @Mapping(source = "deck.member.name", target = "userName")
    @Mapping(source = "deck.member.id", target = "memberId")
    @Mapping(source = "apiCardIds", target = "apiCardIds")
    @Mapping(source = "deck.isPublic", target = "isPublic")
    DeckDetailDto entityToDetailDto(Deck deck, List<String> apiCardIds);
}
