class ApplicationController < ActionController::Base
  def initialize
    twilio_account_ssid = Rails.application.credentials.twilio.account_ssid!
    twilio_auth_token = Rails.application.credentials.twilio.auth_token!
    p twilio_account_ssid
    p twilio_auth_token
    @twilio_client = Twilio::REST::Client.new(twilio_account_ssid, twilio_auth_token)

  end
end
