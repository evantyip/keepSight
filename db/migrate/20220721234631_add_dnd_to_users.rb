class AddDndToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :dnd, :boolean, :default => false
  end
end
