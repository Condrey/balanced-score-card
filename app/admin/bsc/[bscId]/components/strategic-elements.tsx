import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BSCData } from "@/lib/types";

interface StrategicElementsProps {
	bsc: BSCData;
}

export function StrategicElements({ bsc }: StrategicElementsProps) {
	return (
		<Card className="max-w-4xl">
			<CardHeader>
				<CardTitle className="uppercase">Section 2: BSC Strategic Elements</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2.5 *:text-justify *:before:font-bold *:before:uppercase">
				<p className='before:content-["Mandate:_"]'>{bsc.mandate}</p>
				<p className='before:content-["Vision:_"]'>{bsc.vision}</p>
				<p className='before:content-["Mission:_"]'>{bsc.mission}</p>
				<p className='before:content-["Goal:_"]'>{bsc.goal}</p>
				<p className='whitespace-pre-line before:content-["National_Development_Plan_Programmes:_"]'>
					{bsc.ndpProgrammes.map((p) => `\n-${p}`)}
				</p>
				<p className='before:content-["Departmental_Mandate:_"]'>{bsc.departmentalMandate}</p>
				<p className='whitespace-pre-line before:content-["Strategic_Objectives:_"]'>
					{bsc.strategicObjectives.map((o) => `\n-${o}`)}
				</p>
			</CardContent>
		</Card>
	);
}
