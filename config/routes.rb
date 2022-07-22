Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "main#index"

  namespace :api do
    namespace :v1 do
      resources :users, only: [:create]
      post "/verify", to: "users#verify"
      post "/sms", to: "twilio#sms"
    end
  end
  
end
