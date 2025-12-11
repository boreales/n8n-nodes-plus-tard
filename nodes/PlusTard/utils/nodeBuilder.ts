import type { INodeProperties } from 'n8n-workflow';
import type { PlusTardResource, PlusTardResourceModule } from '../types';
import { PLUSTARD_RESOURCES } from '../types';

export function buildResourceSelector(): INodeProperties {
	return {
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: PLUSTARD_RESOURCES.map((resource) => ({
			name: resource.name,
			value: resource.value,
			description: resource.description,
		})),
		default: '',
	};
}

export function buildOperationSelector(
	resource: PlusTardResource,
	resourceModule: PlusTardResourceModule,
): INodeProperties {
	return {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: '',
		displayOptions: {
			show: {
				resource: [resource],
			},
		},
		options: resourceModule.operations.map((op) => ({
			name: op.name,
			value: op.value,
			action: op.action,
			routing: op.routing as never,
		})),
	};
}

export function buildNodeProperties(
	resourceModules: Record<PlusTardResource, PlusTardResourceModule>,
): INodeProperties[] {
	const properties: INodeProperties[] = [];

	// Add resource selector
	properties.push(buildResourceSelector());

	// Add operation selectors for each resource
	Object.entries(resourceModules).forEach(([resource, module]) => {
		properties.push(buildOperationSelector(resource as PlusTardResource, module));
	});

	// Add all fields from all resources
	Object.values(resourceModules).forEach((module) => {
		properties.push(...module.fields);
	});

	return properties;
}
