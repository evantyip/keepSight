class Api::V1::TwilioController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_user, only: [:sms]

  def sms 
    params = sms_params 
    body = params[:Body].downcase()

    twiml = Twilio::TwiML::MessagingResponse.new do |r|
      if body.include? "help"
        r.message body: "Set do not disturb mode on for X hours by texting \"DND X hours\""
      elsif body.include? "dnd"
        num_hours = body.tr("^0-9", '').to_i
        @user.update(dnd: true)
        if @user.save 
          TurnOffDndJob.perform_in(num_hours.hours, @user.number)
          r.message body: "Set dnd for #{num_hours} hour(s)"
        else
          r.message body: "Something went wrong. Try again."
        end
      end
    end
    
    render xml: twiml.to_s
  end

  private 
  def set_user 
    @user = User.find_by_number(params[:From])
  end

  def sms_params 
    params.permit(:Body, :From, :ToCountry, :ToState, :SmsMessageSid, :NumMedia, :ToCity, :FromZip, :SmsSid, :FromState, :SmsStatus, :FromCity, :FromCountry, :To, :ToZip, :NumSegments, :ReferralNumMedia, :MessageSid, :AccountSid, :ApiVersion)
  end
end
