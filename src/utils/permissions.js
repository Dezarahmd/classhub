function isClassManager(role){
    return role === "ketua" || role === "wakil"
}

export function canManageTasks(role) {
  return isClassManager(role)
}

export function canManageMembers(role) {
    return role === "ketua"
}

export function canManageSubjects(role) {
    return isClassManager(role)
}