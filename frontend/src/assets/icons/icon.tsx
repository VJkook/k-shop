import { User } from './User'
import { Services } from './Services'
import { Request } from './Request'
import { Basket } from './Basket'
import { Profile } from './Profile'

export enum EIcons {
	user,
	services,
	request,
	basket,
	profile,
}

const ICONS: Record<EIcons, any> = {
	[EIcons.user]: User,
	[EIcons.services]: Services,
	[EIcons.request]: Request,
	[EIcons.basket]: Basket,
	[EIcons.profile]: Profile,
}

interface IIconProps {
	name: EIcons
}

export function Icon(props: IIconProps) {
	const { name } = props

	const ChosenIcon = ICONS[name]
	return <ChosenIcon />
}
