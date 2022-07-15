namespace :twilio_sms do
  desc "Send SMS Reminder Message"
  task :sms_eye_reminder => :environment do |_, args| 
    @twilio_client = Twilio::REST::Client.new(Rails.application.credentials.twilio.account_ssid!, Rails.application.credentials.twilio.auth_token!)
    @twilio_from = Rails.application.credentials.twilio.phone_number!

    User.all.each do |user| 
      message = "Hi #{user.name}, give your eyes a break! And look somewhere 20 feet away for 20 seconds."
      # puts "#{user.name} #{user.number}"
      @twilio_client.messages.create(
        body: message,
        to: user.number,
        from: @twilio_from 
      )
      rescue Twilio::REST::TwilioError => e
        puts e.message
    end
  end
end
