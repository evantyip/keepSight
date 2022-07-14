class UsersController < ApplicationController
  def index
    from = Rails.application.credentials.twilio.phone_number!
    to = "+18186250228"

    @twilio_client.messages.create(
      from: from,
      to: to,
      body: "Test Messages"
    )
    render json: { hello: "hello" }, status: :ok 
  end
end
