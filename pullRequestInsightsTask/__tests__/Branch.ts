import { Build } from '../Build';
import * as sinon from 'sinon';
import { Branch } from '../Branch';
import { IPipeline } from '../IPipeline';

describe('Branch Tests', () => {
    
    let failedBuildOne: IPipeline;
    let successfulBuildTwo: IPipeline;
    let failedBuildThree: IPipeline;
    let successfulBuildFour: IPipeline;
    let branch: Branch;

    beforeEach(() =>{
        failedBuildOne = new Build(null, null);
        successfulBuildTwo = new Build(null, null);
        failedBuildThree = new Build(null, null);
        successfulBuildFour = new Build(null, null);

        let builds: IPipeline[] = [failedBuildOne, successfulBuildTwo, failedBuildThree, successfulBuildFour]
        for (let buildNumber = 0; buildNumber < builds.length; buildNumber++){
            sinon.stub(builds[buildNumber], "getId").returns(buildNumber);
        }
        sinon.stub(failedBuildOne, "isFailure").returns(true);
        sinon.stub(failedBuildThree, "isFailure").returns(true);
        sinon.stub(successfulBuildTwo, "isFailure").returns(false);
        sinon.stub(successfulBuildFour, "isFailure").returns(false);
    })

    test("Counts pipeline failure streak of multiple fails", ()=>{
        branch = new Branch("", [failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.getPipelineFailStreak()).toEqual(4); 
    });

    test("Does not count any pipeline failure streak when first pipeline does not fail", ()=>{
        branch = new Branch("", [successfulBuildTwo, failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne]);
        expect(branch.getPipelineFailStreak()).toEqual(0); 
    });

    test("Does not count any pipeline failure streak when no pipelines fail", ()=>{
        branch = new Branch("", [successfulBuildTwo, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.getPipelineFailStreak()).toEqual(0); 
    });

    test("Gets most recently failed pipeline", ()=> {
        branch = new Branch("", [failedBuildOne, failedBuildThree, successfulBuildTwo]);
        expect(branch.getMostRecentFailedPipeline()).toEqual(failedBuildOne);
        expect(branch.getMostRecentFailedPipeline()).not.toEqual(failedBuildThree);
    });

    test("Gets most recently failed pipeline when first few succeed", ()=> {
        branch = new Branch("", [successfulBuildTwo, successfulBuildFour, failedBuildOne]);
        expect(branch.getMostRecentFailedPipeline()).toEqual(failedBuildOne);
    });

    test("Gets no pipeline when no pipelines fail", ()=> {
        branch = new Branch("", [successfulBuildFour, successfulBuildTwo]);
        expect(branch.getMostRecentFailedPipeline()).toBeNull();
    });

    test("Too many pipelines failed when when failure streak of pipelines is larger than threshold", () => {
        branch = new Branch("", [failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.tooManyPipelinesFailed(2)).toBe(true);
    });

    test("Too many pipelines failed is false when failure streak of pipelines is shorter than threshold", () => {
        branch = new Branch("", [failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.tooManyPipelinesFailed(2)).toBe(true);
    });
})