import {Showroom} from "../entities";
import ErrorHandler from "../utils/errorHandler";
import {ControllerFn, UserRole} from "../types";


export const showRoomAccess: ControllerFn = async (req, _res, next) => {
    const user = req.user
    if (!user) {
        return next(new ErrorHandler("Unauthorized User", 401))
    }
    const showroom = await Showroom.findOne({
        where: {showroomName: user.assignedShowroom},
    })
    if (user.assignedShowroom === 'All' && user.role.includes(UserRole.SA)) {
        next()
    } else if (showroom && user.role.includes(UserRole.SO) || user.role.includes(UserRole.SM)) {
        req.showroomId = showroom?.id
        next()
    } else {
        return next(new ErrorHandler("You Don't have permission to This Showroom", 401))
    }
}