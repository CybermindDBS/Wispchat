package com.cdev.wispchat.model.dto;

import java.util.ArrayList;
import java.util.List;

public class ChatroomDTO {
    String chatroomId;
    String name;
    List<MemberDTO> members = new ArrayList<>();
    String ownerId;
    String ownerName;

    public List<MemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<MemberDTO> members) {
        this.members = members;
    }

    public String getChatroomId() {
        return chatroomId;
    }

    public void setChatroomId(String chatroomId) {
        this.chatroomId = chatroomId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    @Override
    public String toString() {
        return "ChatroomDTO{" +
                "chatroomId='" + chatroomId + '\'' +
                ", name='" + name + '\'' +
                ", members=" + members +
                ", ownerId='" + ownerId + '\'' +
                ", ownerName='" + ownerName + '\'' +
                '}';
    }
}
