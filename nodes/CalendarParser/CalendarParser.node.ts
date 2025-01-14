import {get} from 'lodash';

import {INodeExecutionData, INodeType, INodeTypeDescription, IExecuteFunctions, NodeConnectionType} from 'n8n-workflow';

// @ts-ignore
import ical from 'ical';

import iconv from 'iconv-lite';
import {CalendarComponent, VEvent} from '../../types/ical';

// noinspection JSUnusedGlobalSymbols
export class CalendarParser implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Calendar Parser',
		name: 'calendarParser',
		group: ['transform'],
		version: 1,
		description: 'Parse iCal File',
		defaults: {
			name: 'iCal Parser',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Source Key',
				name: 'sourceKey',
				type: 'string',
				default: 'data',
				required: true,
				placeholder: 'data',
				description: 'The name of the binary key to get data from',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const item = items[itemIndex];

			const sourceKey = this.getNodeParameter('sourceKey', itemIndex) as string;

			const value = get(item.binary, sourceKey);

			if (value === undefined) {
				// No data found so skip
				continue;
			}

			const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, sourceKey);

			const stringToParse = iconv.decode(buffer, 'utf8');
			const data = Object.values<CalendarComponent>(ical.parseICS(stringToParse));

			const events = data.filter((item) => item.type === 'VEVENT') as VEvent[];

			events.forEach((event) => {
				returnData.push({
					json: event,
				});
			});
		}

		return this.prepareOutputData(returnData);
	}
}
