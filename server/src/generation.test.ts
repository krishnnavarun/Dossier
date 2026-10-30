import { describe,expect,it } from 'vitest';
import { validateGenerated } from './generation.js';
import { sampleCase } from './sample.js';
describe('generated mystery validation',()=>{
 it('accepts a complete deterministic medium fixture',()=>{expect(()=>validateGenerated(sampleCase,'medium')).not.toThrow()});
 it('rejects incorrect difficulty counts',()=>{expect(()=>validateGenerated(sampleCase,'easy')).toThrow(/match the selected difficulty/i)});
 it('rejects unresolved suspect references',()=>{const invalid={...sampleCase,clues:sampleCase.clues.map((clue,i)=>i===0?{...clue,suspectIds:['missing']}:clue)};expect(()=>validateGenerated(invalid,'medium')).toThrow(/only reference/i)});
 it('rejects a solution without supporting clues',()=>{const invalid={...sampleCase,clues:sampleCase.clues.map(clue=>({...clue,suspectIds:clue.suspectIds.filter(id=>id!=='theo')}))};expect(()=>validateGenerated(invalid,'medium')).toThrow(/supported by at least three clues/i)});
});
