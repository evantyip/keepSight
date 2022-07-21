class Api::V1::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    render json: { users: User.all }, status: :ok 
  end

  def verify 
    code = generate_confirm_code
    message = "KeepSight verification code: #{code}"
    @twilio_client.messages.create(
      body: message,
      to: user_params[:number],
      from: @twilio_from
    ) 

    render json: {code: code}, status: :ok 
  end

  def create 
    @user = User.new(user_params)
    if @user.save 
      render json: @user, status: :created
    else 
      render json: {errors: @user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  private 
  def user_params 
    params.require(:user).permit(:name, :number)
  end

  def generate_confirm_code 
    rand(10 ** 6).to_s.rjust(6,'0')
  end
end
