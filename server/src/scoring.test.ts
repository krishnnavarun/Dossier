import { describe,expect,it } from 'vitest';
import { calculateScore } from './scoring.js';
import type { Difficulty } from './types.js';
describe('calculateScore',()=>{
 it.each([['easy',100],['medium',150],['hard',200]] as const)('awards base points for correct %s accusation', (difficulty:Difficulty,points:number)=>{expect(calculateScore(difficulty,true,0,0).score).toBe(points)});
 it('adds distinct clue points and subtracts hint penalties',()=>{expect(calculateScore('medium',true,4,2)).toEqual({score:150,breakdown:{base:150,clues:20,hints:20}})});
 it('awards no base points for an incorrect accusation and clamps at zero',()=>{expect(calculateScore('easy',false,0,8)).toEqual({score:0,breakdown:{base:0,clues:0,hints:80}})});
});
