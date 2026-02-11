package com.cdev.wispchat.model.dto;

public class MemberDTO {
    String memberId;
    String memberName;
    Boolean admin;

    public MemberDTO(String memberId, String memberName, Boolean admin) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.admin = admin;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }
}
