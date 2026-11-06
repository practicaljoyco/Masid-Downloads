cask "masid" do
  version "0.0.3"
  sha256 "515a49d312758a6d49b2c7f47db38d1c910c8443cdfa902be8d9450412790dc4"

  url "https://github.com/practicaljoyco/Masid-Downloads/releases/download/v0.0.3/Masid-PracticalJoyCo_0.0.3_arm64-macos.zip"
  name "Masíd"
  desc "Calm, local monitoring by Practical Joy Co."
  homepage "https://github.com/practicaljoyco/Masid-Downloads"

  depends_on arch: :arm64
  depends_on macos: :sequoia
  app "Masíd.app"
end
