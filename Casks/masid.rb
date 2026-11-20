cask "masid" do
  version "1.0.0"
  sha256 "4e4a9f1b73df27f00b3badfbe9629adee47559a0f906e5f62dc14a76b0c6ec9e"

  url "https://github.com/practicaljoyco/Masid-Downloads/releases/download/v1.0.0/Masid-QolophonStudio_1.0.0_arm64-macos.zip"
  name "Masíd"
  desc "Calm, local monitoring by Qolophon Studio."
  homepage "https://github.com/practicaljoyco/Masid-Downloads"

  depends_on arch: :arm64
  depends_on macos: :sequoia
  app "Masíd.app"
end
