class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  
  def initialize
    super 
    @twilio_client = Twilio::REST::Client.new(Rails.application.credentials.twilio.account_ssid!, Rails.application.credentials.twilio.auth_token!)
    @twilio_from = Rails.application.credentials.twilio.phone_number!
  end
end
