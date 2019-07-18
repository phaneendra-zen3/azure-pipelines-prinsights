import { AbstractTable } from "./AbstractTable";
import { AbstractPipeline } from "./AbstractPipeline";
import { Branch } from "./Branch";
import messages from './user_messages.json';
import { LongRunningValidation } from "./LongRunningValidation";

export class FailureTable extends AbstractTable {

    constructor(currentCommentData?: string) {
        super(messages.failureCommentTableHeading, messages.failureCommentTableEndName, currentCommentData);
    }

    public addSection(current: AbstractPipeline, currentDefinitionLink: string, target: Branch, numberPipelinesToConsiderForHealth: number, longRunningValidations: LongRunningValidation[]): void {
        if (this.tableHasData()) {
            if (current.isFailure()) {
                let messageString: string = messages.failureCommentRow;
                if (target.isHealthy(numberPipelinesToConsiderForHealth)) {
                    messageString = messages.successCommentRow;
                }
            this.addTextToTableInComment(AbstractTable.NEW_LINE + messageString.format(current.getDefinitionName(), current.getLink(), target.getTruncatedName(), currentDefinitionLink));
            }
        }
    }
}