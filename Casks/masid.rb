cask "masid" do
  version "0.0.4"
  sha256 "46a2ba473219bb11763e427938c4a233dce64fa6d81efa965a1ed1e79c6f20cc"

  url "https://github.com/practicaljoyco/Masid-Downloads/releases/download/v0.0.4/Masid-PracticalJoyCo_0.0.4_arm64-macos.zip"
  name "Masíd"
  desc "Calm, local monitoring by Practical Joy Co."
  homepage "https://github.com/practicaljoyco/Masid-Downloads"

  depends_on arch: :arm64
  depends_on macos: :sequoia
  app "Masíd.app"
end
