//
//  Utils.swift
//  FulaModule
//
//  Created by Homayoun on 5/15/23.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

extension String {

    func fromBase64() -> String? {
        guard let data = Data(base64Encoded: self) else {
            return nil
        }

        return String(data: data, encoding: .utf8)
    }

    func toBase64() -> String {
        return Data(self.utf8).base64EncodedString()
    }

}
