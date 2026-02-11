package com.cdev.wispchat.model.entity;

import java.util.Objects;

public class Member {
    String memberId;
    Boolean admin;

    public Member(String memberId, Boolean admin) {
        this.memberId = memberId;
        this.admin = admin;
    }

    public boolean isAdmin() {
        return admin;
    }

    public String getMemberId() {
        return memberId;
    }

    @Override
    public boolean equals(Object other) {
        if (other instanceof Member otherMember)
            return this.memberId.equals(otherMember.memberId);
        else return false;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.memberId);
    }
}
