package com.gaurav.microservices.signup.dto;

public class SignUpRequestDTO {
    private String username;
    private String first_name;
    private String last_name;
    private String email;
    private String password;
    private String confirm_password;
    private String payment_mode;

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirst_name() { return first_name; }
    public void setFirst_name(String first_name) { this.first_name = first_name; }

    public String getLast_name() { return last_name; }
    public void setLast_name(String last_name) { this.last_name = last_name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirm_password() { return confirm_password; }
    public void setConfirm_password(String confirm_password) { this.confirm_password = confirm_password; }

    public String getPayment_mode() { return payment_mode; }
    public void setPayment_mode(String payment_mode) { this.payment_mode = payment_mode; }
}