package iuh.fit.se.user_service.mapper;

import org.mapstruct.Mapper;

import java.util.Arrays;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class StringListMapper {
    public List<String> stringToList(String value) {
        return value == null ? List.of() : Arrays.stream(value.split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    public String listToString(List<String> list) {
        return list == null ? null : String.join(", ", list);
    }
}
