class UsersController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: { users: User.all }, status: :ok 
  end

  def new
    @user = User.new
  end

  def create 
    @user = User.new(user_params)
    if @user.save 
      render json: @user, status: :created 
    else 
      render json: { errors: @user.errors.full_messages }, 
             status: :unprocessable_entity 
    end
  end

  private 
  def user_params 
    params.require(:user).permit(:name, :number)
  end
end
