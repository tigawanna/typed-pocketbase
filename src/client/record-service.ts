import {
	RecordService,
	RecordOptions,
	RecordSubscription,
	SendOptions,
	UnsubscribeFunc,
	OAuth2AuthConfig,
	RecordAuthResponse,
	CommonOptions
} from 'pocketbase';
import { serializeFilter, Filter } from '../filter.js';
import { resolveSelect } from '../select.js';
import { GenericCollection, GenericSchema } from '../types.js';
import {
	FORWARD_METHODS,
	AuthCollectionService
} from './record-interface.js';
import { TypedPocketBase } from '../client.js';



export type TypedRecordServiceSchema = Omit<
	AuthCollectionService<GenericCollection>,
	| 'unsubscribe'
	| 'listAuthMethods'
	| 'requestPasswordReset'
	| 'confirmPasswordReset'
	| 'requestVerification'
	| 'confirmVerification'
	| 'requestEmailChange'
	| 'confirmEmailChange'
	| 'listExternalAuths'
	| 'unlinkExternalAuth'
	| 'requestOTP'
>;

export class TypedRecordService<Schema extends GenericSchema> implements TypedRecordServiceSchema {
	constructor(readonly service: RecordService<any>) {
		for (const name of FORWARD_METHODS) {
			// @ts-ignore
			this[name] = this.service[name].bind(this.service);
		}
	}

	get client() {
		return this.service.client;
	}

	get collectionName() {
		return this.service.collectionIdOrName;
	}

	private prepareOptions({
		select,
		filter,
		sort,
		...options
	}: RecordOptions = {}): RecordOptions {
		const { expand, fields } = resolveSelect(select);

		if (fields) options.fields = fields;
		if (expand) options.expand = expand;
		if (filter) options.filter = serializeFilter(filter) ?? '';

		if (Array.isArray(sort) && sort.length) {
			options.sort = sort.join(',');
		} else if (sort) {
			options.sort = sort;
		}

		return options;
	}

	createFilter(filter: Filter<Record<string, any>>) {
		return serializeFilter(filter);
	}

	createSort(...sorters: any[]): any {
		return sorters.filter((x) => typeof x === 'string').join(',');
	}

	createSelect(select: any) {
		return select;
	}

	subscribe(
		topic: string,
		callback: (data: RecordSubscription<any>) => void,
		options?: SendOptions
	): Promise<UnsubscribeFunc> {
		return this.service.subscribe(
			topic,
			callback,
			this.prepareOptions(options)
		);
	}

	getFullList(options?: SendOptions) {
		return this.service.getFullList(this.prepareOptions(options));
	}

	getList(page?: number, perPage?: number, options?: SendOptions) {
		return this.service.getList(
			page,
			perPage,
			this.prepareOptions(options)
		);
	}

	getFirstListItem(filter: string, options?: SendOptions) {
		return this.service.getFirstListItem(
			filter,
			this.prepareOptions(options)
		);
	}

	getOne(
		id: string,
		options?: {
			select?: any;
		} & SendOptions
	): Promise<any> {
		return this.service.getOne(id, this.prepareOptions(options));
	}

	create(
		bodyParams?:
			| {
					[key: string]: any;
			  }
			| FormData,
		options?: {
			select?: any;
		} & SendOptions
	) {
		return this.service.create(bodyParams, this.prepareOptions(options));
	}

	update(
		id: string,
		bodyParams?:
			| FormData
			| {
					[key: string]: any;
			  },
		options?: {
			select?: any;
		} & SendOptions
	) {
		return this.service.update(
			id,
			bodyParams,
			this.prepareOptions(options)
		);
	}

	delete(id: string, options?: SendOptions) {
		return this.service.delete(id, this.prepareOptions(options));
	}

	authWithPassword(
		usernameOrEmail: string,
		password: string,
		options?: RecordOptions | undefined
	) {
		return this.service.authWithPassword(
			usernameOrEmail,
			password,
			this.prepareOptions(options)
		);
	}

	authWithOAuth2Code(
		provider: string,
		code: string,
		codeVerifier: string,
		redirectUrl: string,
		createData?: { [key: string]: any } | undefined,
		options?: RecordOptions | undefined
	) {
		return this.service.authWithOAuth2Code(
			provider,
			code,
			codeVerifier,
			redirectUrl,
			createData,
			this.prepareOptions(options)
		);
	}

	authWithOAuth2(options: OAuth2AuthConfig): Promise<RecordAuthResponse> {
		return this.service.authWithOAuth2(options);
	}

	authRefresh(options?: RecordOptions | undefined) {
		return this.service.authRefresh(this.prepareOptions(options));
	}
	authWithOTP(otpId: string, password: string, options?: CommonOptions) {
		return this.service.authWithOTP(
			otpId,
			password,
			this.prepareOptions(options)
		);
	}

}
