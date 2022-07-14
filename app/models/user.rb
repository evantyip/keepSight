class User < ApplicationRecord
  validates :name, presence: true 
  validates :number, presence: true, uniqueness: true 
end
