import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const repo='practicaljoyco/Masid-Downloads';
const sha=process.env.INCOMING_SHA;
if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Invalid handoff commit');
const git=(...args)=>execFileSync('git',args,{maxBuffer:100*1024*1024});
const gh=(...args)=>execFileSync('gh',args,{encoding:'utf8'});
const metadata=JSON.parse(git('show',`${sha}:release/manifest.json`).toString('utf8'));
if(!/^\d+\.\d+\.\d+$/.test(metadata.version) || !/^[a-f0-9]{40}$/.test(metadata.sourceCommit)) throw new Error('Invalid release version/commit');
const {version}=metadata;
const mac=`Masid-PracticalJoyCo_${version}_arm64-macos.zip`;
const required=[mac,`Masid-PracticalJoyCo_${version}_x64-setup.exe`,`Masid-PracticalJoyCo_${version}_arm64-setup.exe`,'Install-Masid.ps1','INSTALL-WINDOWS.txt','SHA256SUMS.txt'];
if(!Array.isArray(metadata.assets) || metadata.assets.length!==required.length || required.some(n=>!metadata.assets.some(a=>a.name===n))) throw new Error('Incomplete package set');
await mkdir('publish-assets',{recursive:true});
for(const asset of metadata.assets) {
 if(!required.includes(asset.name) || !/^[a-f0-9]{64}$/.test(asset.sha256)) throw new Error('Unrecognized asset');
 const bytes=git('show',`${sha}:release/${asset.name}`);
 if(bytes.length!==asset.size || createHash('sha256').update(bytes).digest('hex')!==asset.sha256) throw new Error(`Corrupt asset: ${asset.name}`);
 await writeFile(path.join('publish-assets',asset.name),bytes);
}
await writeFile('publish-assets/manifest.json',JSON.stringify(metadata,null,2)+'\n');
function lookup(tag) {
 try {return JSON.parse(gh('release','view',tag,'-R',repo,'--json','tagName,isDraft'));}
 catch(error) {
  const releases=JSON.parse(gh('api',`repos/${repo}/releases?per_page=100`));
  if(releases.some(r=>r.tag_name===tag)) throw error;
  return null;
 }
}
const numbered=lookup(`v${version}`);
const snapshot=numbered && !numbered.isDraft;
const tag=snapshot?'next':`v${version}`;
const notes=`Masíd ${version} by Practical Joy Co.\n\nUnsigned development builds. Windows can warn or block installation; macOS signing/notarization is not configured. GitHub/Homebrew do not supply OS trust. Native Windows hardware and installation validation remain pending.\n\nIncludes configurable CPU/GPU activity, memory-pressure and drive-space notifications; local drive names and graphs; Forest, Tangerine, Cerise, Lilac and Lime accents.\n\n${snapshot?'Latest development snapshot; numbered releases and the stable Homebrew cask stay unchanged.':'Apple-silicon Mac and Windows x64/ARM64 packages. Homebrew instructions are in the repository README.'}\n\nPublic package manifest includes source revision ${metadata.sourceCommit}.\n`;
await writeFile('release-notes.md',notes);
if(!lookup(tag)) gh('release','create',tag,'-R',repo,'--draft','--title',`Masíd ${version}${snapshot?' — development snapshot':''}`,'--notes-file','release-notes.md');
if(snapshot) gh('release','edit',tag,'-R',repo,'--title',`Masíd ${version} — development snapshot`,'--notes-file','release-notes.md','--prerelease');
const names=[...required,'manifest.json'].map(n=>path.join('publish-assets',n));
// Clobber is allowed for drafts or next only. Published numbered releases are
// never selected here, so their Homebrew-pinned package stays immutable.
gh('release','upload',tag,'-R',repo,...names,'--clobber');
gh('release','edit',tag,'-R',repo,'--draft=false',...(snapshot?['--prerelease']:['--latest']));
// Reconcile the cask even if a previous run published successfully but failed
// before committing the cask. Always use the actual numbered release digest.
const stable=JSON.parse(gh('api',`repos/${repo}/releases/latest`));
if(!/^v\d+\.\d+\.\d+$/.test(stable.tag_name)) throw new Error('Unexpected numbered release tag');
const stableVersion=stable.tag_name.slice(1);
const stableMac=`Masid-PracticalJoyCo_${stableVersion}_arm64-macos.zip`;
const asset=stable.assets.find(a=>a.name===stableMac);
if(!asset) throw new Error('Numbered release is missing its Mac package');
let hash=asset.digest?.match(/^sha256:([a-f0-9]{64})$/)?.[1];
if(!hash) {
 await mkdir('stable-assets',{recursive:true});
 gh('release','download',stable.tag_name,'-R',repo,'--pattern',stableMac,'--dir','stable-assets','--clobber');
 hash=createHash('sha256').update(await readFile(path.join('stable-assets',stableMac))).digest('hex');
}
await mkdir('Casks',{recursive:true});
await writeFile('Casks/masid.rb',`cask "masid" do\n  version "${stableVersion}"\n  sha256 "${hash}"\n\n  url "https://github.com/${repo}/releases/download/v${stableVersion}/${stableMac}"\n  name "Masíd"\n  desc "Calm, local monitoring by Practical Joy Co."\n  homepage "https://github.com/${repo}"\n\n  depends_on arch: :arm64\n  depends_on macos: :sequoia\n  app "Masíd.app"\nend\n`);
git('config','user.name','Practical Joy Co. releases');git('config','user.email','294439637+practicaljoyco@users.noreply.github.com');
git('add','Casks/masid.rb');
if(git('diff','--cached','--name-only').length) {git('commit','-m',`Update Masíd Homebrew cask to ${stableVersion}`);git('push','origin','HEAD:main');}
console.log(`Published ${tag}; Homebrew matches ${stable.tag_name}.`);
