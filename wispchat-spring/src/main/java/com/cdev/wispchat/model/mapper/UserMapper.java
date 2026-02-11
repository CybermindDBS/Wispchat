package com.cdev.wispchat.model.mapper;

import com.cdev.wispchat.model.dto.UserDTO;
import com.cdev.wispchat.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    UserDTO toDto(User user);
}
