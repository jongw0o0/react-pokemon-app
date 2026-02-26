package com.pokepoke.arch.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class EnergyListConverter implements AttributeConverter<List<String>, String> {

    // 리스트를 DB에 저장할 때
    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) return "";
        return String.join(",", attribute);
    }

    // DB 데이터를 객체로 읽어올 때
    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return List.of();
        return Arrays.stream(dbData.split(","))
                     .map(String::trim)
                     .collect(Collectors.toList());
    }
}