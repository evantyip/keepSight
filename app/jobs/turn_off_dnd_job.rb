class TurnOffDndJob < ApplicationJob
  queue_as :default

  def perform(from_number)
    user = User.find_by(number: from_number)
    user.dnd = false 
    user.save 
  end
end
