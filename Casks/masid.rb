cask "masid" do
  version "0.0.5"
  sha256 "9829710b617defcd7add88ffdf1af6b17f56951cb0b92a6787661fa3031408f3"

  url "https://github.com/practicaljoyco/Masid-Downloads/releases/download/v0.0.5/Masid-PracticalJoyCo_0.0.5_arm64-macos.zip"
  name "Masíd"
  desc "Calm, local monitoring by Practical Joy Co."
  homepage "https://github.com/practicaljoyco/Masid-Downloads"

  depends_on arch: :arm64
  depends_on macos: :sequoia
  app "Masíd.app"
end
